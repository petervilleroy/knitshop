class CreateDrafts < ActiveRecord::Migration
  def change
    create_table :drafts do |t|
      t.text :code
      t.references :user, index: true

      t.timestamps null: false
    end
    add_foreign_key :drafts, :users
  end
end
