from django import forms
from django.core.exceptions import ValidationError

ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', ]
MAX_FILE_SIZE = 6 * 1024 * 1024
class UploadFileForm(forms.Form):
    file = forms.FileField()
    
    def clean_file(self):
        print("clean caleed")
        uploaded_file = self.cleaned_data.get('file')

   
        if uploaded_file.content_type not in ALLOWED_FILE_TYPES:
            raise ValidationError("Invalid file type. Allowed types: JPEG, PNG")

        if uploaded_file.size > MAX_FILE_SIZE:
            raise ValidationError("File size exceeds limit")

        return uploaded_file
