import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

#from etl import perform_etl

#perform_etl()

app = Flask(__name__)


#################################################
# Database Setup
#################################################
#engine = create_engine('sqlite://', echo=False)

#disaster_final.to_sql('disasters', con=engine)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///static/db/disasterdb.sqlite"
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

"""# Save references to each table
Samples_Metadata = Base.classes.sample_metadata
Samples = Base.classes.samples
"""

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/debugtest")
def debug():
    """This is for making sure connection to database is correct"""
    df = pd.read_sql_query("SELECT * FROM DISASTERS", db.session.bind)
    data = {"FIPS Codes": df['FIPS Code'].values.tolist(), "Begin Dates":df['Incident Begin Date'].values.tolist()}
    return jsonify(data)

"""
@app.route("/county/<params>")
def countyRoute(params):
    if params[0:5]=="00000":
        return "No Data"
    multiple = False
    query = "SELECT *, COUNT(1) FROM DISASTERS WHERE ("
    if params[0]=="1":
        query = query + "`Incident Type` = 'Hurricane' "
        multiple = True
    if params[1]=="1":
        if multiple== True:
            query = query + "OR "
        query = query + "`Incident Type` = 'Earthquake' "
        multiple = True
    if params[2]=="1":
        if multiple== True:
            query = query + "OR "
        query = query + "`Incident Type` = 'Tornado' "
        multiple = True
    if params[3]=="1":
        if multiple== True:
            query = query + "OR "
        query = query + "`Incident Type` = 'Fire' "
        multiple = True
    if params[4]=="1":
        if multiple== True:
            query = query + "OR "
        query = query + "`Incident Type` = 'Flood' "

    query = query + ") AND (`Incident Begin Date` >= " + params[5:9] + " AND `Incident Begin Date` <= " + params[9:13]
    query = query + ") GROUP BY `FIPS Code`"
    df = pd.read_sql_query(query, db.session.bind)
    data = dict(zip(df['FIPS Code'].values.tolist(), df['COUNT(1)'].values.tolist()))
    return jsonify(data)
"""

@app.route("/county/<params>")
def countyRoute(params):
   if params[0:5]=="00000":
       return jsonify({})
   multiple = False
   query = """SELECT `FIPS Code`, COUNT(1) AS TOTAL,
         COUNT(case `Incident Type` when 'Flood' then 1 else null end) AS FloodCount,
        COUNT(case `Incident Type` when 'Hurricane' then 1 else null end) AS HurricaneCount,
        COUNT(case `Incident Type` when 'Fire' then 1 else null end) AS FireCount,
        COUNT(case `Incident Type` when 'Tornado' then 1 else null end) AS TornadoCount,
        COUNT(case `Incident Type` when 'Earthquake' then 1 else null end) AS EarthquakeCount FROM DISASTERS WHERE ("""
   if params[0]=="1":
       query = query + "`Incident Type` = 'Hurricane' "
       multiple = True
   if params[1]=="1":
       if multiple== True:
           query = query + "OR "
       query = query + "`Incident Type` = 'Earthquake' "
       multiple = True
   if params[2]=="1":
       if multiple== True:
           query = query + "OR "
       query = query + "`Incident Type` = 'Tornado' "
       multiple = True
   if params[3]=="1":
       if multiple== True:
           query = query + "OR "
       query = query + "`Incident Type` = 'Fire' "
       multiple = True
   if params[4]=="1":
       if multiple== True:
           query = query + "OR "
       query = query + "`Incident Type` = 'Flood' "

   query = query + ") AND (`Incident Begin Date` >= " + params[5:9] + " AND `Incident Begin Date` <= " + params[9:13]
   query = query + ") GROUP BY `FIPS Code`"
   df = pd.read_sql_query(query, db.session.bind)
   col =['FIPS Code','TOTAL','FloodCount','HurricaneCount','FireCount','TornadoCount','EarthquakeCount']
   count_df = df[col].copy()
   data = count_df.set_index("FIPS Code").T.to_dict()
   return jsonify(data)


@app.route("/state/<params>")
def stateRoute(params):
    if params[0:5]=="00000":
        return jsonify({})
    multiple = False
    query = """SELECT `State Code`, COUNT(1) AS TOTAL,
          COUNT(case `Incident Type` when 'Flood' then 1 else null end) AS FloodCount,
         COUNT(case `Incident Type` when 'Hurricane' then 1 else null end) AS HurricaneCount,
         COUNT(case `Incident Type` when 'Fire' then 1 else null end) AS FireCount,
         COUNT(case `Incident Type` when 'Tornado' then 1 else null end) AS TornadoCount,
         COUNT(case `Incident Type` when 'Earthquake' then 1 else null end) AS EarthquakeCount FROM (SELECT * FROM DISASTERS WHERE ("""
    if params[0]=="1":
        query = query + "`Incident Type` = 'Hurricane' "
        multiple = True
    if params[1]=="1":
        if multiple== True:
            query = query + "OR "
        query = query + "`Incident Type` = 'Earthquake' "
        multiple = True
    if params[2]=="1":
        if multiple== True:
            query = query + "OR "
        query = query + "`Incident Type` = 'Tornado' "
        multiple = True
    if params[3]=="1":
        if multiple== True:
            query = query + "OR "
        query = query + "`Incident Type` = 'Fire' "
        multiple = True
    if params[4]=="1":
        if multiple== True:
            query = query + "OR "
        query = query + "`Incident Type` = 'Flood' "

    query = query + ") AND (`Incident Begin Date` >= " + params[5:9] + " AND `Incident Begin Date` <= " + params[9:13]
    query = query + ") GROUP BY `Disaster Number`) GROUP BY `State Code`"
    df = pd.read_sql_query(query, db.session.bind)
    col =['State Code','TOTAL','FloodCount','HurricaneCount','FireCount','TornadoCount','EarthquakeCount']
    count_df = df[col].copy()
    data = count_df.set_index("State Code").T.to_dict()
    return jsonify(data)

@app.route("/table/<params>")
def tableRoute(params):
   result = pd.read_sql(f"SELECT `Incident Begin Date`, Title, `Disaster Number` FROM DISASTERS WHERE (`Incident Type` = 'Fire' OR `Incident Type` = 'Hurricane' OR `Incident Type` = 'Earthquake' OR `Incident Type` = 'Tornado' OR `Incident Type` = 'Flood') AND `State Code` = {params} GROUP BY `Disaster Number` ORDER BY `Incident Begin Date`", db.session.bind)
   data = result.to_dict()
   return jsonify(data)


if __name__ == "__main__":
    app.run()
