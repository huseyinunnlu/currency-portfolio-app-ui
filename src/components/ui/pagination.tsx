import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon className="h-4 w-4" />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon className="h-4 w-4" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

interface PaginationWrapperProps {
  currentPage: number
  totalPages?: number
  onPageChange: (page: number) => void
  totalItems?: number
  itemsPerPage?: number
  showEllipsis?: boolean
  maxPagesToShow?: number
  className?: string
}

function PaginationWrapper({
  currentPage,
  totalPages = 0,
  totalItems,
  itemsPerPage,
  onPageChange,
  showEllipsis = true,
  maxPagesToShow = 5,
  className
}: PaginationWrapperProps) {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > calculatedTotalPages) return;
    onPageChange(page);
  };

  // If both totalItems and itemsPerPage are provided, calculate total pages
  const calculatedTotalPages = React.useMemo(() => {
    if (totalItems !== undefined && itemsPerPage !== undefined && itemsPerPage > 0) {
      return Math.ceil(totalItems / itemsPerPage);
    }
    return totalPages;
  }, [totalItems, itemsPerPage, totalPages]);

  const getPageNumbers = () => {
    const pages = [];
    const actualMaxPages = Math.min(maxPagesToShow, calculatedTotalPages);

    // Logic to show pages around current page
    if (calculatedTotalPages <= actualMaxPages) {
      // Show all pages if total is less than max to show
      for (let i = 1; i <= calculatedTotalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= Math.ceil(actualMaxPages / 2)) {
      // Near the start
      for (let i = 1; i <= actualMaxPages; i++) {
        pages.push(i);
      }
    } else if (currentPage >= calculatedTotalPages - Math.floor(actualMaxPages / 2)) {
      // Near the end
      for (let i = calculatedTotalPages - actualMaxPages + 1; i <= calculatedTotalPages; i++) {
        pages.push(i);
      }
    } else {
      // In the middle
      const offset = Math.floor(actualMaxPages / 2);
      for (let i = currentPage - offset; i <= currentPage + offset; i++) {
        if (i > 0 && i <= calculatedTotalPages) {
          pages.push(i);
        }
      }
    }

    return pages;
  };


  const pageNumbers = getPageNumbers();
  const showStartEllipsis = showEllipsis && pageNumbers[0] > 1;
  const showEndEllipsis = showEllipsis && pageNumbers[pageNumbers.length - 1] < calculatedTotalPages;

  return (
    <div className={cn("mt-4", className)}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {showStartEllipsis && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {pageNumbers.map((pageNumber) => (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                onClick={() => handlePageChange(pageNumber)}
                isActive={currentPage === pageNumber}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          ))}

          {showEndEllipsis && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(calculatedTotalPages)}>
                  {calculatedTotalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(currentPage + 1)}
              className={currentPage === calculatedTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationWrapper
}
