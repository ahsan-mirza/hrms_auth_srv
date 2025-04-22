import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Question } from './question.model';

@Table({
    tableName: 'question_answers',
    timestamps: true,
    paranoid: true,
})
export class QuestionAnswer extends Model {
    

    @ForeignKey(() => Question)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare questionId: number; // The ID of the question being answered

    @BelongsTo(() => Question)
    declare question: Question; // The question this answer belongs to

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare userId: number; // The ID of the user who provided the answer

    @BelongsTo(() => User)
    declare user: User; // The user who provided the answer

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    declare answer: string; // The content of the answer

}