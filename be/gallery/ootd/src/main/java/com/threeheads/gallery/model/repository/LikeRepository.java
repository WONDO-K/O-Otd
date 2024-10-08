package com.threeheads.gallery.model.repository;

import com.threeheads.gallery.model.entity.MyLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

//찜기능
@Repository
public interface LikeRepository extends JpaRepository<MyLike,Long>{
    List<MyLike> findAllByUserId(Long userId);
}
