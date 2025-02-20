import UserRepository from "../../../src/repositories/user.repository.js";

jest.mock('../../../src/repositories/user.repository.js');

const repository = new UserRepository();

describe('User Repository', () => {
    it('should can add user and return correct data', async () => {
        const mockUser = {
            "full_name": "Indra",
            "email": "indra@example.com",
            "password": "123"
        };

        const expectedUser = {
            id: '1',
            full_name: "Indra",
            email: "indra@example.com",
            phone: null,
            address: null,
            avatar: null,
            role: null,
            token: 565279
        };

        repository.addUser.mockResolvedValue(expectedUser);

        const newUser = await repository.addUser(mockUser);

        expect(repository.addUser).toHaveBeenCalledTimes(1);
        expect(repository.addUser).toHaveBeenCalledWith(mockUser);
        expect(newUser).toEqual(expectedUser);
    });

    it('should throw an error when database operation fails', async () => {
        const mockUser = {
            full_name: "Indra",
            email: "indra@example.com",
            password: "123"
        };

        const errorMessage = "Database error";
        repository.addUser.mockRejectedValue(new Error(errorMessage));

        await expect(repository.addUser(mockUser)).rejects.toThrow(errorMessage);
    });
});