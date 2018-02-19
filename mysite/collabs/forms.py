from django import forms


class ImageUploadForm(forms.Form):
	photo = forms.ImageField()


class EmailVerifyForm(forms.Form):
	email = forms.EmailField()

class UsernameVerifyForm(forms.Form):
	username = forms.CharField(max_length=150)


class PasswordVerifyForm(forms.Form):
	password = forms.CharField(widget=forms.PasswordInput())
