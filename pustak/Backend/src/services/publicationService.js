const pool = require('../config/db');

const getAllPublications = async () => {
  const query = `
    SELECT
      publications.publication_id,
      publications.title,
      publications.bio,
      publications.cover_image_url,
      COUNT(book_publication_create.book_id) AS book_count
    FROM publications
    LEFT JOIN book_publication_create ON publications.publication_id = book_publication_create.publication_id
    GROUP BY publications.publication_id
    ORDER BY publications.title ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

const getPublicationByID = async (id) => {
  const query = `
    SELECT publication_id, title, bio, cover_image_url
    FROM publications
    WHERE publication_id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  getAllPublications,
  getPublicationByID,
};
