from django.shortcuts import render, redirect
from .models import Profile, Project, Major
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .forms import ImageUploadForm, EmailVerifyForm, UsernameVerifyForm, PasswordVerifyForm
import pdb
import json
import datetime


# Create your views here.
@csrf_exempt
def index(request):
	if request.method == 'POST':
	# User has logged in
		username = request.POST['name']
		password = request.POST['password']
	
		user = authenticate(username=username, password=password)
		if user is not None:
			auth_login(request, user)

			projects = Project.objects.filter(collabMajors=user.profile.major).order_by('title')
			context = {
				'projects': projects
			}
			return render(request, 'index.html', context)

		else:
			context = {
				'errors': 'Either username or password is invalid.'
			}
			return render(request, 'login.html', context)

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
	if request.method == 'POST':

		prof_data = request.POST

		user = User.objects.create_user(
			prof_data['name'],
			prof_data['email'],
			prof_data['password'],
			first_name=prof_data['firstname'],
			last_name=prof_data['lastname']
		)

		user.profile.major = Major.objects.filter(name=prof_data['major'])[0]

		if 'photo' in request.FILES:
			form = ImageUploadForm(request.POST, request.FILES)
			if form.is_valid():
				user.profile.photo = form.cleaned_data['photo']
		
		user.save()
		return render(request, 'login.html')
	else: 
		return HttpResponseForbidden("Oops! Should've used POST.")


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

@csrf_exempt
def validate_email(request):
	email = request.POST.get('email', None)
	form = EmailVerifyForm({'email' : email})
	is_taken = User.objects.filter(email=email).exists()
	err = "" if form.is_valid() else json.loads(json.dumps(form.errors))['email'][0]
	context = {
		'is_taken' : is_taken,
		'is_valid' : form.is_valid(),
		'errors' : err
	}
	return JsonResponse(context)

@csrf_exempt
def validate_photo(request):
	
	form = ImageUploadForm(request.POST, request.FILES)
	err = "" if form.is_valid() else json.loads(json.dumps(form.errors))['photo'][0]
	context = {
		'is_valid' : form.is_valid(),
		'errors' : err
	}
	return JsonResponse(context)

@csrf_exempt
def validate_major(request):
	major = request.GET.get('major', None)
	is_valid = Major.objects.filter(name=major).exists()
	context = {
		'is_valid' : is_valid,
		'errors' : ""
	}
	return JsonResponse(context)

@csrf_exempt
def validate_username(request):
	username = request.POST.get('username', None)
	form = UsernameVerifyForm({'username': username})
	is_taken = User.objects.filter(username__iexact=username).exists()
	err = "" if form.is_valid() else json.loads(json.dumps(form.errors))['username'][0]
	context = {
		'is_taken' : is_taken,
		'is_valid' : form.is_valid(),
		'errors' : err
	}
	return JsonResponse(context)

@csrf_exempt
def validate_password(request):
	password = request.POST.get('password', None)
	form = PasswordVerifyForm({'password' : password})
	err = "" if form.is_valid() else json.loads(json.dumps(form.errors))['password'][0]
	context = {
		'is_valid' : form.is_valid(),
		'errors' : err
	}
	return JsonResponse(context)


