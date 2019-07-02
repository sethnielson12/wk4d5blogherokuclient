

var app = new Vue ( {
    el: "#app",

    data: {
        page: "blog",
        drawer: false,
        categories: [
            "all",
            "clothing",
            "hunting",
            "books",
            "cards",
            "coins",
            "keychains",
            "comic books",
            "misc."
        ],
        selected_category: "all",
        posts: [ ],
        new_title: "",
        new_author: "",
        new_category: "all",
        new_image: "",
        new_text: "",
        secret_keycode:"",
        server_url: "https://wk5d4blogheroku.herokuapp.com",
        postHolder: {},

    },

    created: function() {
        this.getPosts();
        window.addEventListener("keyup", this.keyEvents);
    },

    methods: {
        keyEvents: function(event) {
          console.log(event.which);
          if (event.which = 68) {
            if (this.secret_keycode == "") {
              this.secret_keycode = "D";
            } else {
              this.secret_keycode = "";
            }
          } else if (event.which == 69) {
            if (this.secret_keycode == "D") {
              this.secret_keycode = "DE";
            } else {
              this.secret_keycode = "";
            }
          } else if (event.which == 76) {
            if (this.secret_keycode == "DE") {
              this.secret_keycode = "DEL";
            } else {
              this.secret_keycode = "";
            }
          } else {
            this.secret_keycode = "";
          }
          console.log(this.secret_keycode);
        },
        getPosts: function() {
            fetch(this.server_url + "/posts").then(function(res) {
                res.json().then(function(data) {
                    app.posts = data.posts;
                });
            });
        },
        addPost: function() {
            var new_post = {
                title: this.new_title,
                author: this.new_author,
                category: this.new_category,
                date: new Date(),
                image: this.new_image,
                text: this.new_text,
            };
            fetch(this.server_url + "/posts", {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(new_post)
            }).then(function() {
                app.new_title = "";
                app.new_author = "";
                app.category = "all";
                app.new_image = "";
                app.new_text = "";
                app.page = "blog";
                app.getPosts();
            });
        },
        formatDate: function(post) {
            var date = new Date(post.date);
            return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
        },
        selectCategory: function(category) {
            this.selected_category = category;
            this.drawer = false;
        },
        deletePost: function(post) {
          // T B C
          fetch(`${this.server_url}/posts/${post._id}`, {
            method: "DELETE"
          }).then(function(response) {
            if (response.status == 204) {
              console.log("it worked");
              app.getPosts();
            } else if (response.status == 400) {
              response.json().then(function ( data ) {
                alert(data.msg);
              });
            }
          });
        },
        changeToEditPost: function(post) {
          this.page = "editPost";
          this.postIdHolder = post._id;
          this.new_title = post.title;
          this.new_author = post.author;
          this.category = post.category;
          this.new_image = post.image;
          this.new_text = post.text;
          console.log(post);
        },
        editPost: function() {
            var edited_post = {
                title: this.new_title,
                author: this.new_author,
                category: this.new_category,
                image: this.new_image,
                text: this.new_text,
            };
            fetch(`${this.server_url}/posts/${app.postIdHolder}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(edited_post)
            }).then(function() {
                app.new_title = "";
                app.new_author = "";
                app.category = "all";
                app.new_image = "";
                app.new_text = "";
                app.page = "blog";
                app.getPosts();
            });
        },

    },

    computed: {
        show_delete: function() {
          return this.secret_keycode == "DEL";
        },
        sorted_posts: function() {
            if (this.selected_category == "all") {
                return this.posts;
            } else {
                var sorted_posts = this.posts.filter(function(post) {
                    return post.category == app.selected_category;
                });
                return sorted_posts;
            }
        }
    }
} )
