class CreateLogintests < ActiveRecord::Migration[8.0]
  def change
    create_table :logintests do |t|
      t.string :email
      t.text :password

      t.timestamps
    end
  end
end
