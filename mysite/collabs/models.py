from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

def user_dir_path(instance, filename):
	return 'user/{0}.jpg'.format(instance.id)

def project_dir_path(instance, filename):
	return 'project/{0}.jpg'.format(slugify(instance.title))

# Create your models here.
class Major(models.Model):
	name = models.CharField(max_length=32, unique=True)

	class Meta:
		ordering = ["name"]

	def __str__(self):
		return self.name


class Profile(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	major = models.ForeignKey(Major, on_delete=models.SET_NULL, null=True)
	photo = models.ImageField(upload_to=user_dir_path, default='user/no-photo.jpg')

	def __str__(self):
		return self.user.username

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class Project(models.Model):
	owner = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
	title = models.CharField(max_length=32)
	tagline = models.CharField(max_length=256, blank=True)
	description = models.TextField('description')
	created = models.DateTimeField('create_date')
	fulfilled = models.BooleanField(default=False)
	collabMajors = models.ManyToManyField(Major)
	collabUsers = models.ManyToManyField(Profile, blank=True, related_name="collaborators", related_query_name="collaborators")
	photo = models.ImageField(upload_to=project_dir_path, default='project/no-photo.jpg')

	class Meta:
		ordering = ["title"]

	def __str__(self):
		return self.title