from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

# Створення бази даних
def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        coins INTEGER NOT NULL DEFAULT 0,
        energy INTEGER NOT NULL DEFAULT 100
    )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/get_user_data', methods=['GET'])
def get_user_data():
    user_id = request.args.get('user_id')
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT coins, energy FROM users WHERE user_id = ?', (user_id,))
    user = cursor.fetchone()
    conn.close()
    if user:
        return jsonify({'coins': user[0], 'energy': user[1]})
    else:
        return jsonify({'coins': 0, 'energy': 100})

@app.route('/update_user_data', methods=['POST'])
def update_user_data():
    data = request.json
    user_id = data['user_id']
    coins = data['coins']
    energy = data['energy']
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute('SELECT coins FROM users WHERE user_id = ?', (user_id,))
    user = cursor.fetchone()
    if user:
        cursor.execute('UPDATE users SET coins = ?, energy = ? WHERE user_id = ?', (coins, energy, user_id))
    else:
        cursor.execute('INSERT INTO users (user_id, coins, energy) VALUES (?, ?, ?)', (user_id, coins, energy))
    conn.commit()
    conn.close()
    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(debug=True)
