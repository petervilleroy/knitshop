class CreateSolutions < ActiveRecord::Migration
  def change
    create_table :solutions do |t|
      t.integer :level
      t.text :content
      t.references :user, index: true

      t.timestamps null: false
    end
    add_foreign_key :solutions, :users
    add_index :solutions, [:user_id, "created_at"]
  end
end
