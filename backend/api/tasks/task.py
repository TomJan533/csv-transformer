import logging
import uuid
from multiprocessing import Manager, Pool

import requests
from celery import shared_task

from api.models import CSVFile, CSVRecord, GenericData

logger = logging.getLogger(__name__)


def fetch_data_from_url(url, page_number, per_page, return_dict):
    try:
        response = requests.get(f"{url}?_page={page_number}&_limit={per_page}")
        response.raise_for_status()
        return_dict[page_number] = response.json()
        logger.info(f"Fetched page {page_number}")
        print(f"Fetched page {page_number}")
    except requests.RequestException as e:
        logger.error(f"Request failed for page {page_number}: {e}")
        print(f"Request failed for page {page_number}: {e}")
        return_dict[page_number] = None


@shared_task
def fetch_and_process_data(request):

    # Generate ActionId for the request
    action_id = uuid.uuid4()
    logger.info(f"ActionId: {action_id}")
    print(f"ActionId: {action_id}")
    request.data["action_id"] = str(action_id)

    # Initial request to get the total count of records
    url = request.data.get("url")

    try:
        initial_response = requests.get(f"{url}?_page=1&_limit=1")
        initial_response.raise_for_status()
    except requests.RequestException as e:
        logger.error(f"Failed to access URL: {url}: {e}")
        print(f"Failed to access URL: {url}: {e}")
        return

    total_count = int(initial_response.headers.get("X-Total-Count", 0))
    per_page = 10  # Adjust based on API's per-page limit
    total_pages = (total_count // per_page) + (1 if total_count % per_page else 0)

    logger.info(f"Total records to fetch: {total_count}, Total pages: {total_pages}")
    print(f"Total records to fetch: {total_count}, Total pages: {total_pages}")

    # Using multiprocessing to fetch data concurrently
    manager = Manager()
    return_dict = manager.dict()

    with Pool(processes=10) as pool:  # Adjust the number of processes
        pool.starmap(
            fetch_data_from_url,
            [(url, page, per_page, return_dict) for page in range(1, total_pages + 1)],
        )

    all_data = []
    for page in range(1, total_pages + 1):
        data = return_dict.get(page)
        if data:
            all_data.extend(data)
        else:
            logger.warning(f"No data returned for page {page}")
            print(f"No data returned for page {page}")

    logger.info(f"Fetched a total of {len(all_data)} records")
    print(f"Fetched a total of {len(all_data)} records")

    # Process all_data as needed
    process_data(all_data, request)


def process_data(data, request):
    """
    Processes and saves the data to the GenericData model.

    Args:
        data (list): List of records to process and save.
        request (object): The request object from the view.
    """
    url = request.data.get("url")
    file_id = request.data.get("fileId")
    selected_column = request.data.get("selectedColumn")
    second_dropdown_value = request.data.get("secondDropdownValue")
    action_id = request.data.get("action_id")

    logger.info(f"Processing {len(data)} records from endpoint {url}")
    print(f"Processing {len(data)} records from endpoint {url}")

    # Prepare records for bulk creation
    records = []
    for item in data:
        records.append(
            GenericData(
                action_id=action_id,
                file_id=file_id,
                selected_column=selected_column,
                second_dropdown_value=second_dropdown_value,
                data=item,
            )
        )

    # Bulk create or update records
    if records:
        GenericData.objects.bulk_create(records, ignore_conflicts=True)
        logger.info(f"Successfully saved {len(records)} records to the database.")
        print(f"Successfully saved {len(records)} records to the database.")
    else:
        logger.warning("No valid records to save.")
        print("No valid records to save.")

    # Create enhanced, joined file
    # Get an instance of CSVFile
    csv_file_instance = CSVFile.objects.get(pk=file_id)

    # Call the copy method
    enhanced_file = csv_file_instance.copy(file_id, action_id)
    logger.info(
        f"Successfully saved {enhanced_file.file_name} records to the database."
    )
    print(f"Successfully saved {enhanced_file.file_name} records to the database.")
