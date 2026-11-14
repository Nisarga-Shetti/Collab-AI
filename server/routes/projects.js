
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all projects from MySQL
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM projects ORDER BY id DESC';

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Could not load projects'
            });
        }

        res.json({
            success: true,
            count: results.length,
            projects: results
        });
    });
});

// Create a new project in MySQL
router.post('/', (req, res) => {
    const {
        name,
        description,
        progress,
        status,
        category,
        team,
        deadline
    } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Project name is required'
        });
    }

    const sql = `
        INSERT INTO projects
        (name, description, progress, status, category, team, deadline)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        name.trim(),
        description || '',
        progress || 0,
        status || 'Planning',
        category || 'General',
        team || 'Not assigned',
        deadline || null
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Could not create project'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            id: result.insertId
        });
    });
});


// Update an existing project
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const {
        name,
        description,
        progress,
        status,
        category,
        team,
        deadline
    } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({
            success: false,
            message: 'Project name is required'
        });
    }

    const sql = `
        UPDATE projects
        SET name = ?, description = ?, progress = ?,
            status = ?, category = ?, team = ?, deadline = ?
        WHERE id = ?
    `;

    const values = [
        name.trim(),
        description || '',
        progress ?? 0,
        status || 'Planning',
        category || 'General',
        team || 'Not assigned',
        deadline || null,
        id
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Could not update project'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            message: 'Project updated successfully'
        });
    });
});


// Delete a project
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM projects WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                success: false,
                message: 'Could not delete project'
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    });
});

module.exports = router;
