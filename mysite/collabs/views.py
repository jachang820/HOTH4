from django.shortcuts import render, redirect
from .models import Profile, Project, Major
from django.http import HttpResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .forms import ImageUploadForm
import pdb
import json
import datetime


# Create your views here.
@csrf_exempt
def index(request):
	if request.method == 'POST':
	# User has logged in
		login_data = request.POST
		pdb.set_trace()
		user = Profile.objects.filter(email=login_data['email']).first()
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
	majors = Major.objects.all().values_list('name', flat=True)
	return render(request, 'signup.html', { 'majors' : majors })

@csrf_exempt
def signup_redirect(request):
	if request.method == 'POST' and 'photo' in request.FILES:
		prof_data = request.POST
		form = ImageUploadForm(request.POST, request.FILES)
		prof = Profile(
			name = prof_data['name'],
			password = prof_data['password'],
			email = prof_data['email'],
			major = Major.objects.filter(name=prof_data['major']).first()
		)
		if form.is_valid():
			prof.photo = form.cleaned_data['photo']
		prof.save()
		return render(request, 'login.html')
	else: 
		return HttpResponseForbidden("An error has occurred while saving profile.")


@csrf_exempt
def upload_pic(request):
	if request.method == 'POST':
		form = ImageUploadForm(request.POST, request.FILES)
		if form.is_valid():
			m = Profile.objects.filter()


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


