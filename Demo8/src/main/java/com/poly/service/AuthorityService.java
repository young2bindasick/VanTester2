package com.poly.service;

import java.util.List;

import com.poly.entity.Authority;

public interface AuthorityService {

	public  List<Authority> findAuthoritiesOfAdministrators();

	public Authority create(Authority auth);
	
	public List<Authority> findAll();
	
	public void delete(Integer id);

}
