package com.threeheads.gallery.model.repository;

import com.threeheads.gallery.model.entity.MyFashion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MyFashionRepository extends JpaRepository<MyFashion,Integer> {
    List<MyFashion> findByUserId(int user_id);
}
