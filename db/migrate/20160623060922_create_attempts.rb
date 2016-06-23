class CreateAttempts < ActiveRecord::Migration
  def change
    create_table :attempts do |t|
      t.references :user, index: true
      t.integer :level
      t.text :content

      t.timestamps null: false
    end
    add_foreign_key :attempts, :users
  end
end
