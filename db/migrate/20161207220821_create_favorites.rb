class CreateFavorites < ActiveRecord::Migration
  def change
    create_table :favorites do |t|
      t.text :thumbnail
      t.text :code
      t.references :user, index: true
      t.integer :author
      t.text :image

      t.timestamps null: false
    end
    add_foreign_key :favorites, :users
  end
end
