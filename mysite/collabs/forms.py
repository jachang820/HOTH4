from django import forms

class ImageUploadForm(forms.Form):
	photo = forms.ImageField()