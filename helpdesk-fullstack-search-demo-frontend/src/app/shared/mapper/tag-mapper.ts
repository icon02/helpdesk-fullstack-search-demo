import {Tag} from '../model/tag';
import {TagFormValue} from '../model/tag-form-value';

export function mapTagToTagFormValue(tag: Tag): TagFormValue {
  return {
    id: tag.id,
    name: tag.name
  }
}

export function mapTagFormValueToTag(formValue: TagFormValue, language: string): Tag {
  return {
    id: formValue.id,
    name: formValue.name,
    language: language,
  }
}
