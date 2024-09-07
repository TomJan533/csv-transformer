import logging
import uuid

import requests
from celery import chord, group, shared_task

from api.models import GenericData
from api.services import CSVFileService

logger = logging.getLogger(__name__)


@shared_task
def fetch_page_data(url, page_number, per_page):
    try:
        response = requests.get(f"{url}?_page={page_number}&_limit={per_page}")
        response.raise_for_status()
        logger.info(f"Fetched page {page_number}")
        return response.json()
    except requests.RequestException as e:
        logger.error(f"Request failed for page {page_number}: {e}")
        return []


@shared_task
def process_fetched_data(
    results, file_id, selected_column, second_dropdown_value, action_id
):
    """
    Process the fetched data, save to the database, and create an enhanced file.
    """
    all_data = []
    for result in results:
        all_data.extend(result)

    logger.info(f"Processing {len(all_data)} records.")

    # Prepare records for bulk creation
    records = [
        GenericData(
            action_id=action_id,
            file_id=file_id,
            selected_column=selected_column,
            second_dropdown_value=second_dropdown_value,
            data=item,
        )
        for item in all_data
    ]

    GenericData.objects.bulk_create(records, ignore_conflicts=True)
    logger.info(f"Successfully saved {len(records)} records to the database.")

    # Create enhanced file
    enhanced_file = CSVFileService.copy_file(file_id, action_id)
    logger.info(f"Enhanced file {enhanced_file.file_name} created.")
    return {"file_name": enhanced_file.file_name}


@shared_task
def fetch_and_process_data(file_id, selected_column, url, second_dropdown_value):
    action_id = str(uuid.uuid4())
    logger.info(f"Generated action_id {action_id}")

    try:
        # Get the total number of records
        initial_response = requests.get(f"{url}?_page=1&_limit=1")
        initial_response.raise_for_status()
        total_count = int(initial_response.headers.get("X-Total-Count", 0))
        per_page = 10  # Adjust as necessary
        total_pages = (total_count // per_page) + (1 if total_count % per_page else 0)
        logger.info(f"Total records: {total_count}, Total pages: {total_pages}")
    except requests.RequestException as e:
        logger.error(f"Failed to access URL {url}: {e}")
        return

    # Create a Celery group of tasks for fetching each page
    fetch_tasks = [
        fetch_page_data.s(url, page, per_page) for page in range(1, total_pages + 1)
    ]

    # Use a Celery chord to process the data after fetching all pages
    chord(fetch_tasks)(
        process_fetched_data.s(
            file_id, selected_column, second_dropdown_value, action_id
        )
    )
