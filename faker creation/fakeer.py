
import json
from faker import Faker
import random

# Initialize Faker
fake = Faker()

# Function to generate random user data
def generate_user_data(num_records):
    users = []
    
    for i in range(num_records):
        name = fake.name()
        username = fake.user_name()
        email = fake.email()
        
        if i < num_records // 4:  # 1/4 of the users as bots
            created_days = random.randint(0, 1)  # Newer creation date
            created_hours = random.randint(0, 3)
            messages_sent = random.randint(101, 200)  # More messages
            connections = random.randint(501, 1000)  # Really high connections
            active_hours = random.randint(13, 15)  # High active time
            last_seen_days = 0  # Always less than 2-3 hours ago
            last_seen_hours = random.randint(0, 2)
            
        else:
            # Regular user attributes
            created_days = random.randint(0, 10)
            created_hours = random.randint(0, 23)
            messages_sent = random.randint(0, 100)
            connections = random.randint(0, 500)
            active_hours = random.randint(1, 24)
            last_seen_days = random.randint(0, 10)
            last_seen_hours = random.randint(0, 23)

        created_at = f"{created_days} days, {created_hours} hours ago"
        last_seen = f"{last_seen_days} days, {last_seen_hours} hours ago"

        users.append({
            "name": name,
            "username": username,
            "email": email,
            "created_at": created_at,
            "last_seen": last_seen,
            "messages_sent": messages_sent,
            "connections": connections,
            "active_hours": active_hours,
            "is_deleted": False,  # Set to False for all users
            "deleted_at": None    # Set to None for all users
        })

    # Shuffle the users to mix bot and regular users
    random.shuffle(users)
    return users

# Function to write data to JSON
def write_to_json(users, filename):
    with open(filename, 'w') as json_file:
        json.dump(users, json_file, indent=4)  # Write to a file in JSON format

# Generate data and write to JSON
if __name__ == "__main__":
    num_records = 1000  # Number of records to generate
    users = generate_user_data(num_records)
    write_to_json(users, 'fake_user_data.json')
    print(f'Generated {num_records} user records in "fake_user_data.json".')
