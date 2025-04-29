class AddScheduleToStudents < ActiveRecord::Migration[8.0]
  def change
    add_column :students, :schedule, :text
  end
end
