from django import forms
from django.core.exceptions import ValidationError

ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/svg+xml',
]
MAX_FILE_SIZE = 15 * 1024 * 1024
class UploadFileForm(forms.Form):
    file = forms.FileField()
    
    def clean_file(self):
        print("clean caleed")
        uploaded_file = self.cleaned_data.get('file')

   
        if uploaded_file.content_type not in ALLOWED_FILE_TYPES:
            allowed = ", ".join([t.split('/')[-1].upper() for t in ALLOWED_FILE_TYPES])
            raise ValidationError(f"Invalid file type. Allowed types: {allowed}")

        if uploaded_file.size > MAX_FILE_SIZE:
            raise ValidationError("File size exceeds limit")

        return uploaded_file
