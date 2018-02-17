import uuid
from django.db import models

# Create your models here.
class Major(models.Model):
	major = models.CharField(max_length=32)

	class Meta:
		ordering = ["major"]

	def __str__(self):
		return self.major


class User(models.Model):
	username = models.CharField('username', max_length=32)
	picture = models.ImageField(
		upload_to='user_images/', 
		default='user_images/None/no-img.jpg', 
		height_field='height', 
		width_field='width')
	email = models.CharField('email', max_length=32)
	logged_in = models.BooleanField()
	major = models.ForeignKey(Major, on_delete=models.SET_NULL, null=True)

	class Meta:
		ordering = ["username"]

	def __str__(self):
		return self.user_name


class Project(models.Model):
	owner = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
	title = models.CharField(max_length=32)
	tagline = models.CharField(max_length=256, blank=True)
	description = models.TextField('description')
	created = models.DateTimeField('create_date')
	fulfilled = models.BooleanField()

	class Meta:
		ordering = ["title"]

	def __str__(self):
		return self.title


class CollabMajor(models.Model):
	major = models.ForeignKey(Major, on_delete=models.CASCADE)
	project = models.ForeignKey(Project, on_delete=models.CASCADE)

	class Meta:
		ordering = ["major", "project"]

	def __str__(self):
		return self.major + "-" + self.project

