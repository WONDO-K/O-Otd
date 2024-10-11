import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime
from gallery_model_file import Gallery  # Make sure to import the Gallery model from your code

# Load the CSV file
df = pd.read_csv('image_data.csv')

# Database connection setup (adjust with your actual DB credentials)
DATABASE_URL = "mysql+pymysql://<your-mysql-user>:<your-mysql-password>!@<your-mysql-host>:<your-mysql-port>/<your-gallery-db-name>"
engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Batch size to control how many records to insert at once
batch_size = 1000  # 한 번에 처리할 데이터 개수
total_rows = len(df)

# Process the data in batches
for i in range(0, total_rows, batch_size):
    batch = []
    for index, row in df.iloc[i:i+batch_size].iterrows():
        gallery_entry = Gallery(
            gallery_id=row['image'].split(".")[0].split("_")[1],
            photo_name=row['image'],
            photo_url=row['path'],
            likes_count=0,
            uploaded_at=datetime.now(),
            type=row['label'],
            is_delete=False
        )
        batch.append(gallery_entry)
    
    # Add batch of records to the session
    session.add_all(batch)
    
    try:
        session.commit()  # Commit the batch to the database
        print(f"{i + len(batch)} rows successfully inserted.")  # Inserted row count
    except Exception as e:
        session.rollback()  # Rollback if there's an error
        print(f"Error inserting batch {i} to {i + len(batch)}: {e}")
    
    # Query the database to check how many rows have been inserted so far
    inserted_count = session.query(Gallery).count()
    print(f"Total rows in the database after batch {i}: {inserted_count}")
    
    # Print the last inserted record for verification
    last_inserted = session.query(Gallery).order_by(Gallery.uploaded_at.desc()).first()
    if last_inserted:
        print(f"Last inserted data: {last_inserted.photo_name}, {last_inserted.photo_url}")

# Final session close
session.close()
