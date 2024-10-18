import json
from datetime import datetime

# Load the existing user data from the JSON file
def load_user_data(filename):
    with open(filename, 'r') as json_file:
        return json.load(json_file)

# Detect bots based on criteria and update their status
def detect_bots(users):
    bot_users = []
    today = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for user in users:
        # Extract relevant data
        created_days = int(user["created_at"].split(" days, ")[0])
        created_hours = int(user["created_at"].split("days, ")[1].split(" hours ago")[0])
        last_seen_days = int(user["last_seen"].split(" days, ")[0])
        last_seen_hours = int(user["last_seen"].split("days, ")[1].split(" hours ago")[0])
        messages_sent = user["messages_sent"]
        connections = user["connections"]
        active_hours = user["active_hours"]

        # Calculate bot score
        bot_score = 0
        if created_days < 7:  # Created less than 7 days ago
            bot_score += 1
        if last_seen_days < 1 and last_seen_hours < 5:  # Last seen < 5 hours ago
            bot_score += 1
        if messages_sent > 50:  # Messages sent > 50
            bot_score += 1
        if connections > 200:  # Connections > 200
            bot_score += 1
        if active_hours > 9:  # Active hours > 9
            bot_score += 1

        # Mark as deleted if bot score is >= 3
        if bot_score >= 3:
            user["is_deleted"] = True
            user["deleted_at"] = today
            bot_users.append(user)
        else:
            user["is_deleted"] = False  # Ensure this is set for non-bot users
            user["deleted_at"] = None    # Ensure deleted_at is None for non-bot users

    return bot_users

# Write updated user data back to the original JSON file
def write_user_data_to_json(users, filename):
    with open(filename, 'w') as json_file:
        json.dump(users, json_file, indent=4)

# Write detected bot users to a new JSON file
def write_bot_users_to_json(bot_users, filename):
    with open(filename, 'w') as json_file:
        json.dump(bot_users, json_file, indent=4)

# Main function
if __name__ == "__main__":
    input_file = 'fake_user_data.json'  # Input JSON file with user data
    output_file = 'detected_bots.json'   # Output JSON file for bot users

    users = load_user_data(input_file)
    bot_users = detect_bots(users)
    write_user_data_to_json(users, input_file)  # Update original data with deletion info
    write_bot_users_to_json(bot_users, output_file)  # Save bot users separately
    
    print(f'Detected bots have been written to "{output_file}".')
    print(f'Updated user data has been saved back to "{input_file}".')
