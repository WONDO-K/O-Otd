package com.threeheads.gallery.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name="Category")
@AllArgsConstructor
@NoArgsConstructor
public class Category {
}
