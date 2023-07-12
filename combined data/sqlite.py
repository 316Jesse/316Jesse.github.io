import sqlite3
import pandas as pd
path1 = 'coins.csv'

df = pd.read_csv(path1)


df.columns = df.columns.str.strip()

connection = sqlite3.connect('mycoins')

df.to_sql('coins', connection, if_exists='replace')


connection.close()