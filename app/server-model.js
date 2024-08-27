const db = require("../db/connection");

exports.getAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.getAllArticles = () => {
  return db
    .query(
      `SELECT articles.*, COUNT (comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON
        comments.article_id = 
        articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      rows.forEach((article) => {
        delete article.body;
      });
      return rows;
    });
};

exports.findArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM ARTICLES WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article does not exist" });
      } else return rows;
    });
};
