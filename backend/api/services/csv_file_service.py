from datetime import datetime

from django.core.exceptions import ValidationError
from django.utils.text import slugify

from api.models import CSVFile, CSVRecord, GenericData


class CSVFileService:
    @staticmethod
    def copy_file(existing_file_id, action_id):
        try:

            existing_file = CSVFile.objects.get(pk=existing_file_id)
            new_file_name = CSVFileService._generate_unique_name(
                existing_file.file_name
            )
            new_file = CSVFile(file_name=new_file_name, file_hash=None)
            new_file.save()

            CSVFileService._copy_records(existing_file, new_file)

            CSVFileService.join_data(existing_file_id, action_id, new_file)

            return new_file
        except CSVFile.DoesNotExist:
            raise ValidationError("The specified CSVFile does not exist.")
        except Exception as e:
            raise ValidationError(f"An error occurred while copying the file: {str(e)}")

    @staticmethod
    def join_data(existing_file_id, action_id, new_file):
        try:
            # Fetch GenericData records related to the given action_id and file_id
            generic_data_records = GenericData.objects.filter(
                file_id=existing_file_id, action_id=action_id
            )

            if not generic_data_records:
                raise ValidationError(
                    "No GenericData found for the given file_id and action_id."
                )

            # Create a map of data using the second_dropdown_value as the key
            data_map = {}
            for generic_data in generic_data_records:
                selected_column = generic_data.selected_column
                second_dropdown_value = generic_data.second_dropdown_value
                data_json = generic_data.data

                # Ensure data_json is a dictionary
                if not isinstance(data_json, dict):
                    raise ValidationError(
                        "Data field in GenericData must be a dictionary."
                    )

                # Update the data map with the generic data
                key = data_json.get(second_dropdown_value)
                if key is not None:
                    data_map[key] = data_json

            # Update the records in the new file
            for record in CSVRecord.objects.filter(csv_file=existing_file_id):
                join_key = getattr(record, selected_column, None)
                if join_key is not None and join_key in data_map:
                    record_data = record.data or {}
                    additional_data = data_map[join_key]
                    record_data.update(additional_data)
                    record.data = record_data
                    record.csv_file = new_file
                    record.save()

        except Exception as e:
            raise ValidationError(f"An error occurred while joining data: {str(e)}")

    @staticmethod
    def _generate_unique_name(original_name):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        slugified_name = slugify(original_name)
        return f"{slugified_name}_{timestamp}"

    @staticmethod
    def _copy_records(original_file, new_file):
        for record in original_file.records.all():
            CSVRecord.objects.create(
                impression_id=record.impression_id,
                impression_city=record.impression_city,
                posting_user_id=record.posting_user_id,
                post_id=record.post_id,
                viewer_email=record.viewer_email,
                impression_country=record.impression_country,
                timestamp=record.timestamp,
                device=record.device,
                data=record.data,
                csv_file=new_file,
            )
