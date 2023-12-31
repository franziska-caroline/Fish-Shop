import useSWR from "swr";
import { useRouter } from "next/router";
import { ProductCard } from "./Product.styled";
import { StyledLink } from "../Link/Link.styled";
import ReviewForm from "../ReviewForm";
import { useState } from "react";
import { StyledButton } from "../Button/Button.styled";
import ProductForm from "../ProductForm";

export default function Product() {
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, mutate } = useSWR(`/api/products/${id}`);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return <p>No data available.</p>;
  }

  async function handleEditProduct(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productData = Object.fromEntries(formData);

    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (response.ok) {
      router.push("/");
      mutate();
    }
  }

  async function handleDeleteProduct(id) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await response.json(); // Ensure the response is fully read

        mutate();
        router.push("/");
      } else {
        console.error(`Error: ${response.status}`);
      }
    } catch (error) {
      console.error("An error occurred during the delete request:", error);
    }
  }

  console.log(data);
  return (
    <>
      <ProductCard>
        <h2>{data.name}</h2>
        <p>Description: {data.description}</p>
        <p>
          Price: {data.price} {data.currency}
        </p>
        {data?.reviews.length > 0 && (
          <>
            <h3>Reviews:</h3>
            <ul>
              {data.reviews.map((review) => (
                <li>{review.title}</li>
              ))}
            </ul>
          </>
        )}
        <StyledLink href="/">Back to all</StyledLink>
        <StyledButton
          onClick={() => {
            setIsEditMode(!isEditMode);
          }}
        >
          Edit
        </StyledButton>
        <StyledButton onClick={() => handleDeleteProduct(id)}>
          Delete
        </StyledButton>
      </ProductCard>
      {isEditMode && <ProductForm onSubmit={handleEditProduct} />}
    </>
  );
}
