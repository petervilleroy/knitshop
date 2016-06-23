class CreatePatterns < ActiveRecord::Migration
  def change
    create_table :patterns do |t|
      t.references :user, index: true
      t.integer :solution_id

      t.timestamps null: false
    end
    add_foreign_key :patterns, :users
  end
end
