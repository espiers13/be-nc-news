const db = require("../db/connection");

exports.getAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.getAllArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT (comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON
        comments.article_id = 
        articles.article_id
        GROUP BY articles.article_id
        ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
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

exports.findComments = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE article_id = $1 ORDER BY comments.created_at DESC`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.findNewestComment = () => {
  return db
    .query(
      `SELECT * FROM comments WHERE comment_id = (SELECT MAX (comment_id) FROM comments);`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.createNewComment = (article_id, username, body) => {
  return db.query(
    `INSERT INTO comments
        (body, author, article_id)
        VALUES
        ($1, $2, $3)`,
    [body, username, article_id]
  );
};

exports.postArticle = (article_id, votes) => {
  db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]);
  return db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2`,
    [votes, article_id]
  );
};
