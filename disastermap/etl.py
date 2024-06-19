#import dependencies
import pandas as pd
import numpy as np

import sqlite3 as sq

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

def perform_etl():
    #import csv files
    fema_df = pd.read_csv("Resources/fema_all-disasters.csv")

    #merge in state codes
    state_df = pd.read_csv("Resources/state_codes.csv")
    disaster_df = pd.merge(fema_df, state_df, on=["State "])

    new_cols = ["Disaster Number", "Disaster Type", "Incident Type","Title","Incident Begin Date", "State ", "State Code","Declared County/Area", "Place Code", ]
    disaster_df2 = disaster_df[new_cols].copy()

    #convert all d-types to strings so we can manipulate them easily later
    disaster_df2["State Code"] = disaster_df2["State Code"].astype(str)
    disaster_df2["Place Code"] = disaster_df2["Place Code"].astype(str)

    #keep only major disasters
    majordisaster_df = disaster_df2.loc[disaster_df2["Disaster Type"] == "DR"]

    #remove all place codes for unincorporated areas and for areas missing specific county data
    #remove place codes that do not start with 99-
    majordisaster_df2 = majordisaster_df.loc[majordisaster_df["Place Code"]>"99000"]

    #remove place codes that are NaN
    disaster_final = majordisaster_df2.dropna()

    #remove 99- from beginning of remaining Place Copdes (new 3 digit value = County FIPS Code)
    disaster_final['Place Code'] = disaster_final['Place Code'].str[2:5]

    #Merge Values in state code + place code together to get a unique FIPS code per county
    disaster_final['FIPS Code']="0"+disaster_final['State Code']+disaster_final['Place Code']

    disaster_final['FIPS Code']=disaster_final['FIPS Code'].str[-5:]

    disaster_final['Incident Begin Date'] = disaster_final['Incident Begin Date'].str[-4:]

    #Cut State Code and Place Code Columns since we have the new FIPS Code column now
    new_cols = ["Disaster Number", "Disaster Type", "Incident Type","Title","Incident Begin Date", "State ", "Declared County/Area", "State Code", "FIPS Code"]
    disaster_final = disaster_final[new_cols].copy()

    return disaster_final

disaster_final = perform_etl()

conn = sq.connect("static/db/disasterdb.sqlite")

disaster_final.to_sql("DISASTERS",conn,if_exists="replace")

conn.commit()

conn.close()
