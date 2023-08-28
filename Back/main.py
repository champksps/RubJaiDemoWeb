from flask import Flask, jsonify, request, make_response
import sqlite3
import pandas as pd
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app, supports_credentials=True)

### Response to CORS OPTION ###
@app.route('/api/activity', methods=['OPTIONS'])
def options():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Methods", "DELETE, OPTIONS")  # Add allowed methods
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    return response

### GET ###
@app.route('/api/activity', methods=['GET'])
def get_all_payment():
    conn = sqlite3.connect('Path DB file')  # เปลี่ยน 'path_to_your_database.db' เป็นเส้นทางที่เก็บฐานข้อมูลของคุณ
    cursor = conn.cursor()
    sqlquery = 'SELECT * FROM test_activity_v2'
    cursor.execute(sqlquery)
    test_activity = cursor.fetchall()

    with app.app_context():
        data_list = []
        for row in test_activity:
            record = {
                'id': row[0],
                'date': row[1],
                'detail': row[2],
                'payment_type': row[3],
                'payment_method' : row[4],
                'amount' : row[5],
                'status' : row[6],
                'payment_date' : row[7]
        }
            data_list.append(record)
    conn.close()

    with app.app_context():
        return jsonify(data_list)
    
# get_all_payment()

### GET ###
@app.route('/api/activity/<int:id>', methods=['GET'])
def get_specific_payment(id):
    conn = sqlite3.connect('Path DB file')  # เปลี่ยน 'path_to_your_database.db' เป็นเส้นทางที่เก็บฐานข้อมูลของคุณ
    cursor = conn.cursor()
    sqlquery = 'SELECT * FROM test_activity_v2 WHERE id = ?'
    cursor.execute(sqlquery, (id,))
    test_activity = cursor.fetchall()
    with app.app_context():
        data_list = []
        for row in test_activity:
            record = {
                'id': row[0],
                'date': row[1],
                'detail': row[2],
                'payment_type': row[3],
                'payment_method' : row[4],
                'amount' : row[5],
                'status' : row[6],
                'payment_date' : row[7]
        }
            data_list.append(record)
    conn.close()
    with app.app_context():
        return jsonify(data_list)

### DELETE ###
@app.route('/api/activity/<int:id>', methods=['DELETE'])
def delete_activity(id):
    conn2 = sqlite3.connect('Path DB file')
    cursor = conn2.cursor()
    cursor.execute('DELETE FROM test_activity_v2 WHERE id = ?', (id,))
    conn2.commit()
    conn2.close()

    with app.app_context():
        return jsonify({"message": "Activity deleted successfully"})

### POST ###
@app.route('/api/activity', methods=['POST'])
def receive_data():
    data = request.get_json()
    save_to_database(data)
    return jsonify({"message": "Data received successfully"})

### Save to db ###
def save_to_database(data):
    conn3 = sqlite3.connect('Path DB file')
    cursor = conn3.cursor()
    cursor.execute('INSERT INTO test_activity_v2 (date,detail,payment_type,payment_method,amount,status,payment_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
                   (data['date'], data['detail'], data['payment_type'], data['payment_method'], data['amount'], data['status'], data['payment_date']))
    conn3.commit()
    conn3.close()

### Log in Session ###
@app.route('/api/user', methods=['POST'])
def receive_login():
    data = request.get_json()
    print(data['username'])
    print(data['password'])
    return checkLogin(data['username'],data['password'])

### Set isLoggedIn ###
def checkLogin(username, password):
    conn3 = sqlite3.connect('Path DB file')
    cursor = conn3.cursor()
    cursor.execute('SELECT * FROM user_test')
    user = cursor.fetchall()
    with app.app_context():
        user_list = []
        for row in user:
            users = {
                'id': row[0],
                'first_name': row[1],
                'last_name': row[2],
                'user_name': row[3],
                'password' : row[4],
                'isLoggedin' : row[5]
        }
            user_list.append(users)
    conn3.close()
    while True:
        user_found = False
        pass_okay = False

        for data in user_list:
            if 'user_name' in data and data['user_name'] == username:
                user_found = True
                if password == data['password']:
                    pass_okay = True

        if user_found and pass_okay:
            message = 'Log in sucessfully!!!'
            break
        elif not user_found:
            message = 'User not found!!!'
            break
        elif not pass_okay:
            message = 'Please input correct password!!!'
            break
    return message

if __name__ == '__main__':
    app.run()