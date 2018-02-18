from django.shortcuts import render, redirect
from .models import Profile, Project, Major
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from django.core.files.storage import FileSystemStorage
import pdb
import json
import datetime


# Create your views here.
@csrf_exempt
def index(request):
	if request.method == 'POST':
	# User has logged in
		login_data = request.POST

		user = Profile.objects.filter(name=login_data['username']).first()
		projects = Project.objects.filter(collabMajors=user.major).order_by('title')
		context = {
			'projects': projects
		}
		return render(request, 'index.html', context)

	elif request.method == 'GET':
	# User has not logged in (we'll add cookies later)
		return redirect('login')

@csrf_exempt
def login(request):
	return render(request, 'login.html')

@csrf_exempt
def signup(request):
	'''
	if request.method == 'POST' and request.FILES['photo']:
		prof_data = request.POST
		pic = request.FILES['photo']
		fs = FileSystemStorage()
		filename = fs.save(prof_data['username'] + "/profile.jpg", pic)
		uploaded_file_url = fs.url(filename)
		return render(request, 'signup.html', {
			'uploaded_file_url': uploaded_file_url
		})
	'''
	return render(request, 'signup.html')

@csrf_exempt
def signup_redirect(request):
	major = Major(name=prof_data['major'])
	major.save()
	prof = Profile(
		name = prof_data['username'],
		email = prof_data['email'],
		major = prof_data['major']
	)
	prof.save()
	return redirect('/')

@csrf_exempt
def project(request, title):
	project = Project.objects.filter(title=title).first()
	context = {
		'project': project
	}
	return render(request, 'project.html', context)

@csrf_exempt
def process(request):
	if request.method == 'POST':
		project_data = request.POST
		proj = Project(
			owner = Profile.objects.filter(name=project_data['username']).first(),
			title = project_data['title'],
			tagline = project_data['tagline'],
			description = project_data['description'],
			created = datetime.date.today(),
		)
		proj.save()
		proj = Project.objects.filter(title=project_data['title']).first()
		majors_list = project_data['majors'].split(",")
		for major_name in majors_list:
			major = Major.objects.filter(name=major_name).first()
			proj.collabMajors.add(major)
		proj.save()
		return redirect('/')


