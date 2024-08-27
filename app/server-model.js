const db = require("../db/connection");

exports.getAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.findArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM ARTICLES WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      return rows;
    });
};
