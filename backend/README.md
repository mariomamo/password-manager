# :gear: Setup PHP backend environment
For local testing you can use xampp
```cmd
docker run --name myXampp -p 41061:22 -p 41062:80 -d -v <path_to_backend/site>:/www tomsik68/xampp:8
```