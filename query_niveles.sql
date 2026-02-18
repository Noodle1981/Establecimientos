SELECT 
    nivel_educativo,
    direccion_area,
    COUNT(*) as total
FROM modalidades
GROUP BY nivel_educativo, direccion_area
ORDER BY nivel_educativo, total DESC;
