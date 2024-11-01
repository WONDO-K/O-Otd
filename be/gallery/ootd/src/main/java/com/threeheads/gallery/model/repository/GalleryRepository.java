package com.threeheads.gallery.model.repository;

import com.threeheads.gallery.model.entity.Gallery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryRepository extends JpaRepository<Gallery,Integer> {

    Gallery findGalleryDetailByGalleryId(int galleryId);

    @Query(value = "SELECT * FROM gallery WHERE type = :type and is_delete=false ORDER BY RAND() LIMIT 20", nativeQuery = true)
    List<Gallery> findGalleryListByType(@Param("type") String type);

    @Query(value = "SELECT * FROM gallery ORDER BY RAND() LIMIT 20", nativeQuery = true)
    List<Gallery> findGalleryRandomList();


    @Query(value = "SELECT * FROM gallery ORDER BY likes_count DESC, gallery_id ASC LIMIT 10", nativeQuery = true)
    List<Gallery> findWeekPick();

    @Query(value = "SELECT photo_url FROM gallery where photo_name LIKE :name",nativeQuery = true)
    String findUrlByImageName(@Param("name") String name);

    @Query(value = "SELECT likes_count FROM gallery where gallery_id=:id ",nativeQuery = true)
    int searchLikesCount(@Param("id") long id);

    @Modifying
    @Query(value = "UPDATE gallery SET likes_count = likes_count + 1 WHERE gallery_id = :id",nativeQuery = true)
    void upLike(@Param("id") long id);
    
}
