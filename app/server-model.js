const db = require("../db/connection");

exports.getAllTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.checkTopicExists = (topic) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "topic does not exist" });
      } else return rows;
    });
};

exports.getAllArticles = (sort_by, order, topic) => {
  let queryStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT (comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON
  comments.article_id = 
  articles.article_id`;

  if (topic) {
    queryStr += ` WHERE articles.topic = '${topic}'`;
  }
  queryStr += ` GROUP BY articles.article_id`;

  if (sort_by === undefined) {
    queryStr += ` ORDER BY articles.created_at`;
  } else queryStr += ` ORDER BY articles.${sort_by}`;

  if (order === "asc" || order === "ASC") {
    queryStr += ` ASC`;
  } else queryStr += ` DESC`;

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

exports.getAllUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.findUserByUsername = (username) => {
  return db
    .query(
      `
  SELECT * FROM users WHERE username = $1`,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "user does not exist" });
      } else return rows[0];
    });
};

exports.findArticleById = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT (comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON
    articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
      [article_id]
    )
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

exports.findCommentById = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment does not exist" });
      }
      return rows[0];
    });
};

exports.findNewestComment = () => {
  return db
    .query(
      `SELECT * FROM comments WHERE comment_id = (SELECT MAX (comment_id) FROM comments);`
    )
    .then(({ rows }) => {
      return rows[0];
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

exports.updateArticle = (article_id, votes) => {
  return db.query(
    `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
    [votes, article_id]
  );
};

exports.deleteComment = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]);
};

exports.updateComment = (comment_id, votes) => {
  return db.query(
    `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2`,
    [votes, comment_id]
  );
};

exports.findArticleByTitle = (title) => {
  return db
    .query(
      `SELECT articles.*, COUNT (comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON
    articles.article_id = comments.article_id
    WHERE articles.title = $1
    GROUP BY articles.article_id`,
      [title]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.createNewArticle = (article) => {
  const values = [article.author, article.title, article.body, article.topic];
  let queryStr = `INSERT INTO articles
  (author, title, body, topic, article_img_url)
  VALUES
  ($1, $2, $3, $4`;

  if (article.article_img_url) {
    values.push(article.article_img_url);
    queryStr += `, $5)`;
  } else {
    queryStr += `, DEFAULT)`;
  }

  return db.query(queryStr, values);
};
