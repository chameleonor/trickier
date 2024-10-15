import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  Table,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Trash2, Pen } from "lucide-react";

export const Main = () => {
  const [accounts, setAccounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(null);
  const [formData, setFormData] = useState({
    account: "",
    status: "",
    reason: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const response = await fetch("/read-accounts");
        const data = await response.json();
        setAccounts(data);
      } catch (error) {
        console.error("Erro ao carregar contas:", error);
      }
    }
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      status: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isEditing
      ? `/update-account/${formData.account}`
      : "/create-account";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(
          `Conta ${isEditing ? "atualizada" : "criada"} com sucesso: ${
            result.message
          }`
        );
        setIsModalOpen(false);
        setIsEditing(false);
        setFormData({ account: "", status: "", reason: "", description: "" });
      } else {
        alert("Erro ao enviar os dados");
      }
    } catch (error) {
      alert("Erro ao se comunicar com o servidor: " + error.message);
    }
  };

  const handleEdit = (account) => {
    setFormData(account);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (accountId) => {
    try {
      const response = await fetch(`/delete-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ account: accountId }),
      });

      if (response.ok) {
        alert(`Conta ${accountId} deletada com sucesso!`);
        setIsDeleteConfirmOpen(null);
        setAccounts(
          accounts.filter((account) => account.account !== accountId)
        );
      } else {
        alert("Erro ao deletar a conta");
      }
    } catch (error) {
      alert("Erro ao se comunicar com o servidor: " + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tabela de Contas</h1>

      {/* Tabela de contas */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Account ID</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Reason</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accounts.map((account, index) => (
            <TableRow key={index}>
              <TableCell>{account.account}</TableCell>
              <TableCell>{account.status}</TableCell>
              <TableCell>{account.reason}</TableCell>
              <TableCell>{account.description}</TableCell>
              <TableCell>
                {/* Ícone de editar */}
                <Button onClick={() => handleEdit(account)} variant="ghost">
                  <Pen className="h-5 w-5 text-blue-500" />
                </Button>
                {/* Ícone de deletar */}
                <Button
                  onClick={() => setIsDeleteConfirmOpen(account.account)}
                  variant="ghost"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
                {/* Confirmação de deletar */}
                {isDeleteConfirmOpen === account.account && (
                  <div className="flex items-center space-x-2">
                    <p>Tem certeza?</p>
                    <Button
                      onClick={() => handleDelete(account.account)}
                      className="text-red-500"
                    >
                      Sim
                    </Button>
                    <Button
                      onClick={() => setIsDeleteConfirmOpen(null)}
                      className="text-gray-500"
                    >
                      Não
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Botão para abrir o modal */}
      <Button
        onClick={() => {
          setIsModalOpen(true);
          setIsEditing(false);
          setFormData({ account: "", status: "", reason: "", description: "" });
        }}
        className="mt-4"
      >
        Novo
      </Button>

      {/* Modal de criação/edição de conta */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Atualizar Conta" : "Criar Nova Conta"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Account ID</Label>
                <Input
                  name="account"
                  value={formData.account}
                  onChange={handleChange}
                  required
                  disabled={isEditing}
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  onValueChange={handleSelectChange}
                  required
                  value={formData.status}
                >
                  <SelectTrigger className="w-full">
                    <span>{formData.status || "Selecione o status"}</span>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending cliente">
                      Pending cliente
                    </SelectItem>
                    <SelectItem value="Pending carrying">
                      Pending carrying
                    </SelectItem>
                    <SelectItem value="Pending mesa">Pending mesa</SelectItem>
                    <SelectItem value="Pending legal">Pending legal</SelectItem>
                    <SelectItem value="Pending cadastro">
                      Pending cadastro
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Reason</Label>
                <Input
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <Button type="submit">
              {isEditing ? "Atualizar Conta" : "Criar Conta"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Main;
