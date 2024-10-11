from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Gallery(Base):
    __tablename__ = 'gallery'

    gallery_id = Column(Integer, primary_key=True)
    photo_name =Column(String, nullable=False) 
    photo_url = Column(String, nullable=False)      # 변경된 부분
    likes_count = Column(Integer, default=0)        # 변경된 부분
    uploaded_at = Column(DateTime, nullable=False)   # 변경된 부분
    type = Column(String, nullable=False)
    is_delete = Column(Boolean, default=False)       # 변경된 부분
