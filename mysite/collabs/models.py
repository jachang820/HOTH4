import uuid
from django.db import models


# Create your models here.
class Major(models.Model):
	name = models.CharField(max_length=32)

	class Meta:
		ordering = ["name"]

	def __str__(self):
		return self.name


class Profile(models.Model):
	name = models.CharField('name', max_length=32)
	picture = models.ImageField(
		upload_to='user_images/', 
		default='user_images/None/no-img.jpg', 
		blank=True)
	email = models.CharField('email', max_length=32, blank=True)
	major = models.ForeignKey(Major, on_delete=models.SET_NULL, null=True)

	class Meta:
		ordering = ["name"]

	def __str__(self):
		return self.name


class Project(models.Model):
	owner = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
	title = models.CharField(max_length=32)
	tagline = models.CharField(max_length=256, blank=True)
	description = models.TextField('description')
	created = models.DateTimeField('create_date')
	fulfilled = models.BooleanField(default=False)
	collabMajors = models.ManyToManyField(Major)
	collabUsers = models.ManyToManyField(Profile, blank=True, related_name="collaborators", related_query_name="collaborators")

	class Meta:
		ordering = ["title"]

	def __str__(self):
		return self.title