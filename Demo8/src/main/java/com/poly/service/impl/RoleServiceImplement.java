package com.poly.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.poly.dao.RoleDAO;
import com.poly.entity.Role;
import com.poly.service.RoleService;

@Service
public class RoleServiceImplement implements RoleService{
	@Autowired
	RoleDAO roleDAO;

	@Override
	public List<Role> getAll() {
	
		return roleDAO.findAll();
	}
	
	
}
