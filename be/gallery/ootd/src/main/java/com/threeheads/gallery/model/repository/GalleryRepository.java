package com.threeheads.gallery.model.repository;

import com.threeheads.gallery.model.entity.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GalleryRepository extends JpaRepository<Gallery,Integer> {

    Gallery findGalleryDetailByGalleyId(int galleryId);
}
