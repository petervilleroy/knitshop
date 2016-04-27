class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.string :password_digest
      t.string :age
      t.string :gender
      t.string :currentLevel
      t.string :lastLogin
      t.string :locked

      t.timestamps null: false
    end
  end
end
