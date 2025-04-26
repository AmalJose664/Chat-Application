set -O errexit

cd core
pip install -r ./requirements.txt

python manage.py collectstatic --no-input
