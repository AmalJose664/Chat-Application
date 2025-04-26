set -O errexit
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

pip install -r ./core/requirements.txt

python ./core/manage.py collectstatic --no-input
