# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20161215034902) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "artifacts", force: :cascade do |t|
    t.text     "thumbnail"
    t.text     "code"
    t.integer  "user_id"
    t.text     "image"
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.string   "uname"
    t.string   "uimage_file_name"
    t.string   "uimage_content_type"
    t.integer  "uimage_file_size"
    t.datetime "uimage_updated_at"
    t.text     "description"
  end

  add_index "artifacts", ["user_id"], name: "index_artifacts_on_user_id", using: :btree

  create_table "attempts", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "level"
    t.text     "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "attempts", ["user_id"], name: "index_attempts_on_user_id", using: :btree

  create_table "drafts", force: :cascade do |t|
    t.text     "code"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "drafts", ["user_id"], name: "index_drafts_on_user_id", using: :btree

  create_table "favorites", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "artifact_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "favorites", ["artifact_id"], name: "index_favorites_on_artifact_id", using: :btree
  add_index "favorites", ["user_id"], name: "index_favorites_on_user_id", using: :btree

  create_table "patterns", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "solution_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "patterns", ["user_id"], name: "index_patterns_on_user_id", using: :btree

  create_table "solutions", force: :cascade do |t|
    t.integer  "level"
    t.text     "content"
    t.integer  "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "solutions", ["user_id", "created_at"], name: "index_solutions_on_user_id_and_created_at", using: :btree
  add_index "solutions", ["user_id"], name: "index_solutions_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "first_name"
    t.string   "last_name"
    t.string   "email"
    t.string   "password_digest"
    t.string   "age"
    t.string   "gender"
    t.string   "currentLevel"
    t.string   "lastLogin"
    t.string   "locked"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "role"
    t.string   "remember_digest"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree

  add_foreign_key "artifacts", "users"
  add_foreign_key "attempts", "users"
  add_foreign_key "drafts", "users"
  add_foreign_key "patterns", "users"
  add_foreign_key "solutions", "users"
end
